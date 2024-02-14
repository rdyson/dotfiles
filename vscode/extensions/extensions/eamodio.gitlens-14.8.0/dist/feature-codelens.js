exports.id=496,exports.ids=[496],exports.modules={756:(e,n,i)=>{i.d(n,{GitCodeLensProvider:()=>GitCodeLensProvider});var t=i(7304),s=i(6848),o=i(1608),a=i(2036),r=i(7824),l=i(4169),c=i(8196),m=i(7348),u=i(6448),d=i(1072),g=i(3284);let GitRecentChangeCodeLens=class GitRecentChangeCodeLens extends t.CodeLens{constructor(e,n,i,t,s,o,a,r,l,c){super(r,c),this.languageId=e,this.symbol=n,this.uri=i,this.dateFormat=t,this.blame=s,this.blameRange=o,this.isFullRange=a,this.desiredCommand=l}getBlame(){return this.blame?.()}};let GitAuthorsCodeLens=class GitAuthorsCodeLens extends t.CodeLens{constructor(e,n,i,t,s,o,a,r){super(a),this.languageId=e,this.symbol=n,this.uri=i,this.blame=t,this.blameRange=s,this.isFullRange=o,this.desiredCommand=r}getBlame(){return this.blame()}};let GitCodeLensProvider=class GitCodeLensProvider{constructor(e){this.container=e}static selector=[{scheme:o.cl.File},{scheme:o.cl.Git},{scheme:o.cl.GitLens},{scheme:o.cl.PRs},{scheme:o.cl.Vsls},{scheme:o.cl.VslsScc},{scheme:o.cl.Virtual},{scheme:o.cl.GitHub}];_onDidChangeCodeLenses=new t.EventEmitter;get onDidChangeCodeLenses(){return this._onDidChangeCodeLenses.event}reset(){this._onDidChangeCodeLenses.fire()}async provideCodeLenses(e,n){let i,s;if(e.isDirty&&(0,g.At)(e.uri))return[];let o=await this.container.documentTracker.getOrAdd(e);if(!o.isBlameable)return[];let a=!1;e.isDirty&&!o.isDirtyIdle&&(a=!0);let m=l.i.get("codeLens",e),d={...m.scopesByLanguage?.find(n=>n.language?.toLowerCase()===e.languageId)};null==d&&(d={language:e.languageId}),null==d.scopes&&(d.scopes=m.scopes),null==d.symbolScopes&&(d.symbolScopes=m.symbolScopes),d.symbolScopes=null!=d.symbolScopes?d.symbolScopes=d.symbolScopes.map(e=>e.toLowerCase()):[];let h=[],C=o.uri;if(a){if(1!==d.scopes.length||!d.scopes.includes("document")){let n;if([n,s]=await Promise.all([this.container.git.isTracked(C),(0,r.CA)("vscode.executeDocumentSymbolProvider",e.uri)]),!n)return h}}else if(n.isCancellationRequested||(1===d.scopes.length&&d.scopes.includes("document")?i=await this.container.git.getBlame(C,e):[i,s]=await Promise.all([this.container.git.getBlame(C,e),(0,r.CA)("vscode.executeDocumentSymbolProvider",e.uri)]),null==i||i?.lines.length===0))return h;if(n.isCancellationRequested)return h;let b=(0,c.qw)(()=>e.validateRange(new t.Range(0,0,1e6,1e6))),y=a?{command:void 0,title:this.getDirtyTitle(m)}:void 0;if(void 0!==s)for(let n of(u.YJ.log("GitCodeLensProvider.provideCodeLenses:",`${s.length} symbol(s) found`),s))this.provideCodeLens(h,e,n,d,b,i,C,m,a,y);if((d.scopes.includes("document")||d.symbolScopes.includes("file"))&&!d.symbolScopes.includes("!file")&&null==h.find(e=>0===e.range.start.line&&0===e.range.end.line)){let n;let s=b();if(a||m.recentChange.enabled){a||(n=(0,c.qw)(()=>this.container.git.getBlameRange(i,C,s)));let o=new t.SymbolInformation(C.fileName,t.SymbolKind.File,"",new t.Location(C.documentUri(),new t.Range(0,0,0,s.start.character)));h.push(new GitRecentChangeCodeLens(e.languageId,o,C,m.dateFormat,n,s,!0,J(o),m.recentChange.command,y))}if(!a&&m.authors.enabled){void 0===n&&(n=(0,c.qw)(()=>this.container.git.getBlameRange(i,C,s)));let o=new t.SymbolInformation(C.fileName,t.SymbolKind.File,"",new t.Location(C.documentUri(),new t.Range(0,1,0,s.start.character)));h.push(new GitAuthorsCodeLens(e.languageId,o,C,n,s,!0,J(o),m.authors.command))}}return h}getValidateSymbolRange(e,n,i,s){let o,a=!1,r=t.SymbolKind[e.kind].toLowerCase();switch(e.kind){case t.SymbolKind.File:(n.scopes.includes("containers")||n.symbolScopes.includes(r))&&(a=!n.symbolScopes.includes(`!${r}`)),a&&(o=i());break;case t.SymbolKind.Package:(n.scopes.includes("containers")||n.symbolScopes.includes(r))&&(a=!n.symbolScopes.includes(`!${r}`)),a&&0===(o=J(e)).start.line&&0===o.end.line&&(o=i());break;case t.SymbolKind.Class:case t.SymbolKind.Interface:case t.SymbolKind.Module:case t.SymbolKind.Namespace:case t.SymbolKind.Struct:(n.scopes.includes("containers")||n.symbolScopes.includes(r))&&(o=J(e),a=!n.symbolScopes.includes(`!${r}`)&&(s||!o.isSingleLine));break;case t.SymbolKind.Constructor:case t.SymbolKind.Enum:case t.SymbolKind.Function:case t.SymbolKind.Method:case t.SymbolKind.Property:(n.scopes.includes("blocks")||n.symbolScopes.includes(r))&&(o=J(e),a=!n.symbolScopes.includes(`!${r}`)&&(s||!o.isSingleLine));break;case t.SymbolKind.String:(n.symbolScopes.includes(r)||"markdown"===n.language&&n.scopes.includes("containers"))&&(o=J(e),a=!n.symbolScopes.includes(`!${r}`)&&(s||!o.isSingleLine));break;default:n.symbolScopes.includes(r)&&(o=J(e),a=!n.symbolScopes.includes(`!${r}`)&&(s||!o.isSingleLine))}return a?o??J(e):void 0}provideCodeLens(e,n,i,s,o,a,r,l,m,u){try{let d;let g=this.getValidateSymbolRange(i,s,o,l.includeSingleLineSymbols);if(void 0===g)return;let h=n.lineAt(J(i).start);if(e.length&&e[e.length-1].range.start.line===h.lineNumber)return;let C=0;if((m||l.recentChange.enabled)&&(m||(d=(0,c.qw)(()=>this.container.git.getBlameRange(a,r,g))),e.push(new GitRecentChangeCodeLens(n.languageId,i,r,l.dateFormat,d,g,!1,h.range.with(new t.Position(h.range.start.line,C)),l.recentChange.command,u)),C++),l.authors.enabled){let s=!g.isSingleLine;if(!s&&"csharp"===n.languageId)switch(i.kind){case t.SymbolKind.File:break;case t.SymbolKind.Package:case t.SymbolKind.Module:case t.SymbolKind.Namespace:case t.SymbolKind.Class:case t.SymbolKind.Interface:case t.SymbolKind.Constructor:case t.SymbolKind.Method:case t.SymbolKind.Function:case t.SymbolKind.Enum:s=!0}s&&!m&&(void 0===d&&(d=(0,c.qw)(()=>this.container.git.getBlameRange(a,r,g))),e.push(new GitAuthorsCodeLens(n.languageId,i,r,d,g,!1,h.range.with(new t.Position(h.range.start.line,C)),l.authors.command)))}}finally{if(k(i))for(let t of i.children)this.provideCodeLens(e,n,t,s,o,a,r,l,m,u)}}resolveCodeLens(e,n){return e instanceof GitRecentChangeCodeLens?this.resolveGitRecentChangeCodeLens(e,n):e instanceof GitAuthorsCodeLens?this.resolveGitAuthorsCodeLens(e,n):Promise.reject(void 0)}resolveGitRecentChangeCodeLens(e,n){let i=e.getBlame();if(null==i)return R("Unknown, (Blame failed)",e);let o=(0,m.KY)(i.commits.values());if(null==o)return R("Unknown, (Blame failed)",e);let a=`${o.author.name}, ${null==e.dateFormat?o.formattedDate:o.formatDate(e.dateFormat)}`;if(l.i.get("debug")&&(a+=` [${e.languageId}: ${t.SymbolKind[e.symbol.kind]}(${e.range.start.character}-${e.range.end.character}${e.symbol.containerName?`|${e.symbol.containerName}`:""}), Lines (${e.blameRange.start.line+1}-${e.blameRange.end.line+1}), Commit (${o.shortSha})]`),!1===e.desiredCommand)return R(a,e);switch(e.desiredCommand){case s.iJ.CopyRemoteCommitUrl:return C(a,e,o,!0);case s.iJ.CopyRemoteFileUrl:return b(a,e,o,!0);case s.iJ.DiffWithPrevious:return h(a,e,o);case s.iJ.OpenCommitOnRemote:return C(a,e,o);case s.iJ.OpenFileOnRemote:return b(a,e,o);case s.iJ.RevealCommitInView:return y(a,e,o);case s.iJ.ShowCommitsInView:return S(a,e,i,o);case s.iJ.ShowQuickCommitDetails:return p(a,e,o);case s.iJ.ShowQuickCommitFileDetails:return f(a,e,o);case s.iJ.ShowQuickCurrentBranchHistory:return w(a,e);case s.iJ.ShowQuickFileHistory:return v(a,e);case s.iJ.ToggleFileBlame:return L(a,e);case s.iJ.ToggleFileChanges:return F(a,e,o);case s.iJ.ToggleFileChangesOnly:return F(a,e,o,!0);case s.iJ.ToggleFileHeatmap:return K(a,e);default:return e}}resolveGitAuthorsCodeLens(e,n){let i=e.getBlame();if(null==i)return R("? authors (Blame failed)",e);let o=i.authors.size,a=m.KY(i.authors.values())?.name??"Unknown",r=`${(0,d.u)("author",o,{zero:"?"})} (${a}${o>1?" and others":""})`;if(l.i.get("debug")&&(r+=` [${e.languageId}: ${t.SymbolKind[e.symbol.kind]}(${e.range.start.character}-${e.range.end.character}${e.symbol.containerName?`|${e.symbol.containerName}`:""}), Lines (${e.blameRange.start.line+1}-${e.blameRange.end.line+1}), Authors (${(0,m.kn)((0,m.kH)(i.authors.values(),e=>e.name),", ")})]`),!1===e.desiredCommand)return R(r,e);let c=(0,m.iw)(i.commits.values(),e=>e.author.name===a)??(0,m.KY)(i.commits.values());if(null==c)return R(r,e);switch(e.desiredCommand){case s.iJ.CopyRemoteCommitUrl:return C(r,e,c,!0);case s.iJ.CopyRemoteFileUrl:return b(r,e,c,!0);case s.iJ.DiffWithPrevious:return h(r,e,c);case s.iJ.OpenCommitOnRemote:return C(r,e,c);case s.iJ.OpenFileOnRemote:return b(r,e,c);case s.iJ.RevealCommitInView:return y(r,e,c);case s.iJ.ShowCommitsInView:return S(r,e,i);case s.iJ.ShowQuickCommitDetails:return p(r,e,c);case s.iJ.ShowQuickCommitFileDetails:return f(r,e,c);case s.iJ.ShowQuickCurrentBranchHistory:return w(r,e);case s.iJ.ShowQuickFileHistory:return v(r,e);case s.iJ.ToggleFileBlame:return L(r,e);case s.iJ.ToggleFileChanges:return F(r,e,c);case s.iJ.ToggleFileChangesOnly:return F(r,e,c,!0);case s.iJ.ToggleFileHeatmap:return K(r,e);default:return e}}getDirtyTitle(e){return e.recentChange.enabled&&e.authors.enabled?l.i.get("strings.codeLens.unsavedChanges.recentChangeAndAuthors"):e.recentChange.enabled?l.i.get("strings.codeLens.unsavedChanges.recentChangeOnly"):l.i.get("strings.codeLens.unsavedChanges.authorsOnly")}};function h(e,n,i){return n.command=(0,r.iK)({title:e,command:o.eq.DiffWithPrevious,arguments:[void 0,{commit:i,uri:n.uri.toFileUri()}]}),n}function C(e,n,i,t=!1){return n.command=(0,r.iK)({title:e,command:o.eq.OpenOnRemote,arguments:[{resource:{type:a.o.Commit,sha:i.sha},repoPath:i.repoPath,clipboard:t}]}),n}function b(e,n,i,t=!1){return n.command=(0,r.iK)({title:e,command:o.eq.OpenOnRemote,arguments:[{resource:{type:a.o.Revision,fileName:i.file?.path??"",sha:i.sha},repoPath:i.repoPath,clipboard:t}]}),n}function y(e,n,i){return n.command=(0,r.iK)({title:e,command:i?.isUncommitted?"":s.iJ.RevealCommitInView,arguments:[n.uri.toFileUri(),{commit:i,sha:void 0===i?void 0:i.sha}]}),n}function S(e,n,i,t){let s;return s=void 0===t?[...(0,m.Gs)(i.commits.values(),e=>e.isUncommitted?void 0:e.ref)]:[t.ref],n.command=(0,r.iK)({title:e,command:0===s.length?"":o.eq.ShowCommitsInView,arguments:[{repoPath:i.repoPath,refs:s}]}),n}function p(e,n,i){return n.command=(0,r.iK)({title:e,command:i?.isUncommitted?"":s.iJ.ShowQuickCommitDetails,arguments:[n.uri.toFileUri(),{commit:i,sha:void 0===i?void 0:i.sha}]}),n}function f(e,n,i){return n.command=(0,r.iK)({title:e,command:i?.isUncommitted?"":s.iJ.ShowQuickCommitFileDetails,arguments:[n.uri.toFileUri(),{commit:i,sha:void 0===i?void 0:i.sha}]}),n}function w(e,n){return n.command=(0,r.iK)({title:e,command:s.iJ.ShowQuickCurrentBranchHistory,arguments:[n.uri.toFileUri()]}),n}function v(e,n){return n.command=(0,r.iK)({title:e,command:s.iJ.ShowQuickFileHistory,arguments:[n.uri.toFileUri(),{range:n.isFullRange?void 0:n.blameRange}]}),n}function L(e,n){return n.command=(0,r.iK)({title:e,command:o.eq.ToggleFileBlame,arguments:[n.uri.toFileUri()]}),n}function F(e,n,i,t){return n.command=(0,r.iK)({title:e,command:o.eq.ToggleFileChanges,arguments:[n.uri.toFileUri(),{type:"changes",context:{sha:i.sha,only:t,selection:!1}}]}),n}function K(e,n){return n.command=(0,r.iK)({title:e,command:o.eq.ToggleFileHeatmap,arguments:[n.uri.toFileUri()]}),n}function R(e,n){return n.command={title:e,command:""},n}function J(e){return k(e)?e.range:e.location.range}function k(e){return(0,c.is)(e,"children")}}};